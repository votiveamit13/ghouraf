export const buildPostFilters = (query) => {
    const f = {}
    if (query.type) f.type = query.type
    if (query.status) f.status = query.status
    if (query.city) f['location.city'] = new RegExp(`^${query.city}$`, 'i')
    if (query.state) f['location.state'] = new RegExp(`^${query.state}$`, 'i')
    if (query.genderPref) f.gender = query.gender
    if (query.roomType) f.roomType = query.roomType
    if (query.furnishing) f.furnishing = query.furnishing
    if (query.lifestyleTags) f.lifestyleTags = { $all: String(query.lifestyleTags).split(',') }
    if (query.budgetMin || query.budgetMax) {
        f['rent.amount'] = {}
        if (query.budgetMin) f.rent.$gte = +query.budgetMin
        if (query.budgetMax) f.rent.$lte = +query.budgetMax
    }
    return f
}