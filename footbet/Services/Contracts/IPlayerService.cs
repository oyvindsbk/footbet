using System.Collections.Generic;
using Footbet.Models;

namespace Footbet.Services.Contracts
{
    public interface IPlayerService
    {
        List<PlayerViewModel> GetPlayerViewModels();
    }
}