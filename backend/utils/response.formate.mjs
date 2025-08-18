export const validationFormate = (err) => {

    const errors = {};
    err.details.forEach(err => {
        const key = err.path.join(".");
        if (!errors[key]) errors[key] = [];
        errors[key].push(err.message);
    });

    return {
        message: `${err.details[0].message} (and ${err.details.length - 1} more errors)`,
        errors,
    }
}