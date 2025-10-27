using Microsoft.AspNetCore.Mvc;

namespace Lab3.Controllers
{
    public class ExamplesController : Controller
    {
        public string Concatenare(string? s1,string? s2)
        {
            return s1 + " " + s2;
        }

        public string Produs(int param1, int? param2)
        {
            if (param2 != null)
                return (param1 * param2).ToString();
            else
                return "Introduceti ambele valori";
        }


        public string Operatie(int? param1, int? param2, string? op)
        {   if(param1==null)return "Introduceti param1";
            if(param2==null)return "Introduceti param2";
            if(op==null)return "Introduceti operatia";

            if (op == "plus") return (param1 + param2).ToString();
            else if (op == "minus") return (param1 - param2).ToString();
            else if (op == "ori") return (param1 * param2).ToString();
            else if (op == "div") return (param1 / param2).ToString();
            else return "Operatie necunoscuta";
        }
    }


}
