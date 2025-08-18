export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        const errors = {};

        if (error) {
            error.details.forEach(err => {
                const key = err.path.join(".");
                if (!errors[key]) errors[key] = [];
                errors[key].push(err.message);
            });
            let message = error.details[0].message;
            if (error.details.length > 0) {
                message = `${error.details[0].message} (and ${error.details.length - 1} more errors)`
            }

            return res.status(422).json({
                message: message,
                errors: errors,
            });
        }
        next();
    };
};