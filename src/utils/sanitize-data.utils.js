export const sanitizeUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isConfirmed: user.isConfirmed,
        createdAt: user.createdAt
    }
}