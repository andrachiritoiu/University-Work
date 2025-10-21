using Microsoft.AspNetCore.Mvc;

namespace Lab3.Controllers
{
    public class StudentsController : Controller
    {
       public string Index()
        {
            return "Afisarea tuturor studentilor";
        }

        public string Create()
        {
            return "Crearea unui nou student";
        }

        public string Show(int? id) 
        {
            if (id is null)
                return "Studentul nu exista in baza de date";
            return "Afisare student cu id-ul: " + id;
        }

        public string Edit(int? id)
        {
            if (id is null)
                return "Studentul nu exista in baza de date";
            return "Editare student cu id-ul: " + id;
        }


        public string Delete(int? id)
        {
            if (id is null)
                return "Studentul nu exista in baza de date";
            return "Stergere student cu id-ul: " + id;
        }
    }
}
