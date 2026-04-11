import type { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import type { Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

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
