const departments = require('./departments');

function routeParcel(parcel) {
  const result = [];
  if (parcel.value > 1000) result.push("Insurance");
  const dept = departments.find(d => parcel.weight <= d.maxWeight);
  if (dept) result.push(dept.name);
  return result;
}

module.exports = { routeParcel }; 