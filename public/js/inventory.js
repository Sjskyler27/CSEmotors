"use strict";

let classificationList = document.querySelector("#classification_id");
console.log(classificationList.value);
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(classification_id);
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      let inventoryDisplay = document.getElementById("inventoryDisplay");
      let invRow = "<tr>";
      invRow += "<td>There are no vehicles to display. </td></tr>";
      inventoryDisplay.innerHTML = invRow;
      console.log(error.message);
    });
});

function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  dataTable += "<tbody>";
  data.forEach(function (element) {
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  inventoryDisplay.innerHTML = dataTable;
}
