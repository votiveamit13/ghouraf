import jwt from 'jsonwebtoken'
import User from '../models/User.mjs'

export const auth = async (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log("payload", payload)
        const user = await User.findById(payload.id)
        console.log("auth user", user)
        if (!user || user.status === 'banned') return res.status(403).json({ message: 'Forbidden' })
        req.user = user
        next()
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

export const requireVerified = (req, res, next) => {
    if (!req.user.emailVerified) return res.status(403).json({ message: 'Verify email first' })
    next()
}