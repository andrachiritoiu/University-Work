using ArticlesApp.Models;
using ArticlesAppLab6.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ArticlesAppLab6.Controllers
{
    public class ArticlesController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext db = context;

        // Se afiseaza lista tuturor articolelor impreuna cu categoria 
        // din care fac parte
        // HttpGet implicit
        public IActionResult Index()
        {
            var articles = db.Articles
                             .Include(a => a.Category)
                             .OrderByDescending(a => a.Date)
                             .ToList();

            return View(articles);
        }

        // Se afiseaza un singur articol in functie de id-ul sau 
        // impreuna cu categoria din care face parte
        // In plus sunt preluate si toate comentariile asociate unui articol
        // HttpGet implicit
        public IActionResult Show(int id)
        {
            Article? article = db.Articles
                                 .Include(a => a.Category)
                                 .Include(a => a.Comments)
                                 .FirstOrDefault(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            return View(article);
        }


        // Se afiseaza formularul in care se vor completa datele unui articol
        // impreuna cu selectarea categoriei din care face parte
        // HttpGet implicit

        public IActionResult New()
        {
            ViewBag.Categories = db.Categories
                                   .OrderBy(c => c.CategoryName)
                                   .ToList();

            return View(new Article());
        }

        // Se adauga articolul in baza de date
        [HttpPost]
        public IActionResult New(Article article)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Categories = db.Categories
                                       .OrderBy(c => c.CategoryName)
                                       .ToList();
                return View(article);
            }

            article.Date = DateTime.Now;
            db.Articles.Add(article);
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        // Se editeaza un articol existent in baza de date impreuna cu categoria din care face parte
        // Categoria se selecteaza dintr-un dropdown
        // HttpGet implicit
        // Se afiseaza formularul impreuna cu datele aferente articolului din baza de date
        public IActionResult Edit(int id)
        {
            Article? article = db.Articles
                                 .Include(a => a.Category)
                                 .FirstOrDefault(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            ViewBag.Categories = db.Categories
                                   .OrderBy(c => c.CategoryName)
                                   .ToList();

            return View(article);
        }

        // Se adauga articolul modificat in baza de date
        [HttpPost]
        public IActionResult Edit(int id, Article requestArticle)
        {
            Article? article = db.Articles.Find(id);

            if (article == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                ViewBag.Categories = db.Categories
                                       .OrderBy(c => c.CategoryName)
                                       .ToList();
                return View(requestArticle);
            }

            article.Title = requestArticle.Title;
            article.Content = requestArticle.Content;
            article.CategoryId = requestArticle.CategoryId;

            db.SaveChanges();

            return RedirectToAction("Show", new { id });
        }

        // Se sterge un articol din baza de date 
        [HttpPost]
        public ActionResult Delete(int id)
        {
            Article? article = db.Articles.Find(id);
            db.Articles.Remove(article);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}

