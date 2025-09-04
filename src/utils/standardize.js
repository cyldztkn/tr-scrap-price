function standardize(val) {
  if (typeof val !== "string") {
    console.log("output:", val);
    return val;
  }
  if (val === "asil-celik") {
    return "Asil Çelik";
  }

  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default standardize;
