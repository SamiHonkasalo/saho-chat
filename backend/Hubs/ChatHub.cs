using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace saho_chat_backend.Hubs
{
    public class ChatHub : Hub
    {
        public async override Task OnConnectedAsync()
        {
            var id = Context.ConnectionId;
            await Clients.Client(id).SendAsync("setConnectionId", id);
        }

        public async Task UserConnected(string username)
        {
            var id = Context.ConnectionId;
            await Clients.All.SendAsync("userConnected", username, id, Guid.NewGuid().ToString());
        }

        public async Task NewMessage(string username, string message)
        {
            var id = Context.ConnectionId;
            await Clients.All.SendAsync("messageReceived", username, id, Guid.NewGuid().ToString(), message);
        }

        public async Task UserDisconnected(string username)
        {
            var id = Context.ConnectionId;
            await Clients.All.SendAsync("userDisonnected", username, id, Guid.NewGuid().ToString());
        }
    }
}