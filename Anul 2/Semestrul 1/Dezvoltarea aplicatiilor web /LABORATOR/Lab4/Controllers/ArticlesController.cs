using Laborator4.Models;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Laborator4.Controllers
{
    public class ArticlesController : Controller
    {
        [NonAction]
        public Article[] GetArticles()
        {
            // Se instantiaza un array de articole 
            Article[] articles = new Article[3];
            // Se creeaza articolele 
            for (int i = 0; i < 3; i++)
            {
                Article article = new Article();
                article.Id = i;
                article.Title = "Articol " + (i + 1).ToString();
                article.Content = "Continut articol " + (i + 1).ToString();
                article.Date = DateTime.Now;
                // Se adauga articolul in array 
                articles[i] = article;
            }
            return articles;
        }


        //Afisarea tutotor articolelor
        //get - afisare
        //post - adaugare

        //[HttpGet]
        //HttpGet este implicit

        //[ActionName("listare")]
        public IActionResult Index()
        {
            Article[] article = GetArticles();

            //Se adauga array-ul de articole intr-un ViewBag pentru a fi trimis in view pentru afisare

            ViewBag.Articole = article;

            //returneaza view-ul din folderul Views, folderul Articles, care are acelsi nume ca si metoda

            return View();
        }


        //afisare a unui articol dupa id
        public IActionResult Show(int? id)
        {
            Article[] article = GetArticles();
            try
            {
                ViewBag.Articol = article[(int)id];
                return View();
            }

            catch (Exception e)
            {
                ViewBag.ErrorMessage = e.Message;
                //return View("Error");
                //sau facem noi un view
                return StatusCode
                    (StatusCodes.Status404NotFound);
            }
        }



        //Afisarea formularului de creare a unui articol
        [HttpGet]
        public IActionResult New()
        {
            return View();
        }


        //supraincarcare
        [HttpPost]
        public IActionResult New(Article article)
        {
            //--- cod adaugare articol in baza de date
            return Content("Articolul a fost adaugat");
        }



        //Edit
        [HttpGet]
        public IActionResult Edit(int? id)
        {
            ViewBag.Id = id;
            return View();
        }


        // POST: Trimiterea modificarilor facute catre server 
        //pentru stocare in baza de date
        [HttpPost]
        public IActionResult Edit(Article article)
        {
            // … cod adaugare articol editat in baza de date  
            //return Redirect(“/Articles/Index”); 
            return View("EditMethod");
        }


        //Delete
        [HttpPost]
        public IActionResult Delete(int? id)
        {
            // … cod stergere articol din baza de date
            return Content("Articolul a fost sters din baza de date!");
        }
    }

}

//metodele non-action sunt metode care nu pot fi apelate direct printr-un request HTTP. Acestea sunt folosite pentru a organiza logica de business sau pentru a furniza funcționalități auxiliare în cadrul unui controller, fără a expune aceste metode ca endpoint-uri accesibile publicului.