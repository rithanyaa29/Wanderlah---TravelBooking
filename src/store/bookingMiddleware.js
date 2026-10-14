
const bookingMiddleware = (store) => (next) => (action) => {
  console.log("Redux Action:", action.type);

  return next(action);
};

export default bookingMiddleware;
