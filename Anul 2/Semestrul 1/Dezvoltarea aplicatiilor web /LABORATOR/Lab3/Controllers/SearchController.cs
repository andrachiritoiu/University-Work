using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace Lab3.Controllers
{
    public class SearchController : Controller
    {
        public string NumarTelefon(string? numar)
        {
            if (numar == null)
            {
                return "Introduceti nuamrul de telefon";
            }

            if (numar.Length < 10)
                return "Numarul de telefon nu are suficiente cifre";

            else if (numar.Length > 10)
                return "Numarul de telefon are prea multe cifre";

            else return "Cautare pentru nr de telefon: " + numar; 
        }
    }
}
