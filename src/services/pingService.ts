import axiosClient from "../utils/axiosClient";

const pingService = {
    ping: async (): Promise<string> => {
        const response = await axiosClient.get<string>("/ping");
        return response.data;
    }
}

export default pingService;
    