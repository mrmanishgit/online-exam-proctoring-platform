import axiosClient from "./axiosClient";

const uploadApi = {
  uploadFile: (file, options = {}) => {
    const formData = new FormData();
    formData.append(options.fieldName || "file", file);
    Object.entries(options.fields || {}).forEach(([key, value]) => formData.append(key, value));
    return axiosClient.post(options.url || "/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: options.onUploadProgress,
    });
  },
  uploadImage: (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(options.url || "/uploads/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: options.onUploadProgress,
    });
  },
};
export default uploadApi;
