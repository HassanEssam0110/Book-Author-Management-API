export const sendResponse = (res, data = {}, code = 200) => {
    return res.status(code).json({ status: 'success', ...data })
};