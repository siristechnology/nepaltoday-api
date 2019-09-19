const { getSortedArticle } = require("./articleHelper");
describe("Sort News with weight", () => {
  it("sort article by weight", () => {
    const article = [
      {
        _id: 1,
        title: "KantipurNews",
        content: "Kantipur first news  content",
        category: "news",
        source: {
          _id: 11,
          link: "https://ekantipur.com"
        }
      },
      {
        _id: 2,
        title: "Kantipur social news",
        content: "Kantipur first  social news  content",
        category: "social",
        source: {
          _id: 12,
          link: "https://ekantipur.com"
        }
      },
      {
        _id: 3,
        title: "seto pati news article",
        content: "setopati first news  content",
        category: "news",
        source: {
          _id: 13,
          link: "https://setopati.com"
        }
      }
    ];

    const sorted = getSortedArticle(article);
    console.log("sorted article", sorted);
  });
});
