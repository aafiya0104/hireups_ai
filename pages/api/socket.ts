import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/socket";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as never;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });

    io.on("connection", (socket: any) => {
      socket.on("leaderboard:join", (contestId: string) => {
        socket.join(`contest:${contestId}`);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
