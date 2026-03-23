export function error500(res){
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
}

export function error400(res, message){
    return res.status(400).json({
      success: false,
      message: message,
    });
}

export function error401(res) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
}

export function error403(res){
    return res.status(403).json({
      message: "Session expired. Please login again.",
      success: false,
    });
}