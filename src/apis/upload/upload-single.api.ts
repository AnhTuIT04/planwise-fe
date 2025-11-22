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

function toString(data: IResponse): string {
    const parsed = new URL(data.data.url);

    // Split path into segments and encode each segment safely
    parsed.pathname = parsed.pathname
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return parsed.toString();
}

export function uploadSingleApi({ file }: IRequest) {
  const formData = new FormData();
  formData.append("file", file);

  return api.safeExec<string>(
    {
      method: "POST",
      url: apiUploadURL + "/single",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
      },
      data: formData,
      withCredentials: false,
    },
    toString,
  );
}
