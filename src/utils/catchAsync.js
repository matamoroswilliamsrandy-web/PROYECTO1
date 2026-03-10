/**
 * Utility to wrap async express middleware to catch errors and pass them to next().
 * @param {Function} fn - Async middleware function
 */
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
