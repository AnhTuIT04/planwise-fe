import api from "@/lib/api";
import { apiUploadURL } from "@/lib/consts";

interface IRequest {
  file: File;
}

interface IResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    key: string;
    url: string;
    bucket: string;
    size: number;
    mimetype: string;
  };
}

export async function uploadSingleApi({ file }: IRequest) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<IResponse>(apiUploadURL + "/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
    withCredentials: false,
  });

  return res.data.data.url;
}
