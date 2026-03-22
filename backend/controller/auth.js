export const login = (req, res) => {
    return res.json({
        message: `Hello user ${req.user.uid}`,
        email: req.user.email
    })
}