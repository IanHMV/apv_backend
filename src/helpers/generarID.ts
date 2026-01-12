const generarID = (): string => {
    const fecha = Date.now().toString(32);
    const random = Math.random().toString(36).substring(2, 8);
    return fecha + random;
}

export default generarID