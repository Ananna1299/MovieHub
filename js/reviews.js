// Fake review database
const reviewDB = {
  tt0372784: [
    {
      id: 1,
      name: "Ananna",
      rating: 5,
      comment: "Amazing movie! Must watch 🔥"
    },
    {
      id: 2,
      name: "Rahim",
      rating: 4,
      comment: "Very entertaining and emotional."
    }
  ],

  tt0111161: [
    {
      id: 1,
      name: "Sadia",
      rating: 5,
      comment: "One of the best movies ever made!"
    }
  ]
};

// reviews
export async function fetchReviews(movieId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reviewDB[movieId] || []);
    }, 500);
  });
}