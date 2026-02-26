export const TryError = (message, status = 500) => {
    const err = new Error(message)
    err.status = status
    return err
}


export const CatchError = (err, res, prodMessage = "Internal server error") => {
    if (err instanceof Error){
        const message = process.env.NODE_ENV === "development" ? err.message : prodMessage
        const status = err.status || 500
        return res.status(status).json({message})
    }

    return res.status(500).json({ message: prodMessage })
}