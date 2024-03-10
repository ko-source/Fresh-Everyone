import jsPDF from "jspdf";
import "jspdf-autotable";

// define a generatePDF function that accepts a tickets argument
const generatePDF = (ticket) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  // const tableColumn = ["Ticket Id","Serial No.", "Name", "Address", "Service", "Sub Service","Charge","Charge Type","Required Hours","Completion Time","Total"];
  // define an empty array of rows
  const tableColumn = [{ dataKey: "A" }, { dataKey: "B" }];

  var address;
  try {
    address =
      ticket.address.line1 +
      "," +
      ticket.address.line2 +
      " ," +
      ticket.address.city +
      " ," +
      ticket.address.state +
      " ," +
      ticket.address.country +
      " ," +
      ticket.address.pincode;
  } catch (e) {
    console.log(e);
    address = "";
  }
  try {
    var total = parseFloat(ticket.total_amount);
    total = total + 0.18 * total;
  } catch (e) {
    console.log(e);
    total = ticket.total_amount;
  }
  const tableData = [
    { A: "Ticket Id", B: ticket.ticketId },
    { A: "Serial No.", B: ticket.customer_id },
    { A: "Name", B: ticket.provider_name },
    { A: "Address", B: address },
    { A: "Service", B: ticket.service_name },
    { A: "Sub Service", B: ticket.sub_service_name },
    { A: "Charge", B: "INR " + ticket.service.charge },
    { A: "Charge Type", B: ticket.service.charge_type },
    { A: "Required Hours", B: ticket.duration },
    { A: "Completion Time", B: ticket.time },
    { A: "Total", B: "INR" + " " + total.toString() },
  ];
  // startY is basically margin-top
  doc.autoTable(tableColumn, tableData, { startY: 30 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + " " + date[1] + " " + date[2] + "/" + date[3];
  // ticket title. and margin-top + margin-left
  doc.text("Employee SZ ESTIMATE", 14, 15);
  doc.text(ticket.time, 14, 26);

  // we define the name of our PDF file.
  doc.save(`report_${ticket.customer_id}.pdf`);
};

export default generatePDF;
