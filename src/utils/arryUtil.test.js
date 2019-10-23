const { sortArrayByWeight } = require("./arrayUtil");

describe("Array Util Test", () => {
  it("sort array by weight", () => {
    const arr = [
      { source: "Kantipur", weight: 50 },
      { source: "Ratopati", weight: 60 },
      { source: "Setopati", weight: 70 },
      { source: "Hariyopati", weight: 70 }
    ];
    const expected = [
      { source: "Setopati", weight: 70 },
      { source: "Hariyopati", weight: 70 },
      { source: "Ratopati", weight: 60 },
      { source: "Kantipur", weight: 50 }
    ];

    const sortedArr = sortArrayByWeight(arr);
    expect(JSON.stringify(sortedArr)).toBe(JSON.stringify(expected));
  });
});
