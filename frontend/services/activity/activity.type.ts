type ActivityDetail = {
    id: string,
    name: string,
    type: "Engineering" | "Medical",
    imageUrl: string,
    description: string,
}

export type ActivityListResponse = {
    activities: ActivityDetail[],
    success: boolean,
    message: string,
}