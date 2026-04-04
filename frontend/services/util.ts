export const getMillis = (t: any) => {
    return t._seconds * 1000 + t._nanoseconds / 1e6;
}