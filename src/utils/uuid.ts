const timestamp = Date.now();
const randomPart = Math.random().toString(36).substring(2, 10);
const uuid = `${timestamp}-${randomPart}`;
export const generateUUID = () => parseInt(uuid);