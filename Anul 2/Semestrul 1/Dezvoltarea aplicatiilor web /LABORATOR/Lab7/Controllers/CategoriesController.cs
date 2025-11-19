using ArticlesApp.Data;
using ArticlesApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ArticlesApp.Controllers
{
    public class CategoriesController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext db = context;

        public ActionResult Index()
        {
            if (TempData.ContainsKey("message"))
            {
                ViewBag.message = TempData["message"].ToString();
            }

            var categories = from category in db.Categories
                             orderby category.CategoryName
                             select category;

            ViewBag.Categories = categories;
            return View();
        }

        public ActionResult Show(int id)
        {
            Category category = db.Categories.Find(id);
            return View(category);
        }

        public ActionResult New()
        {
            return View();
        }

        [HttpPost]
        public ActionResult New(Category cat)
        {
            try
            {
                db.Categories.Add(cat);
                db.SaveChanges();
                TempData["message"] = "Categoria a fost adaugata";
                return RedirectToAction("Index");
            }

            catch (Exception e)
            {
                return View(cat);
            }
        }

        public ActionResult Edit(int id)
        {
            Category category = db.Categories.Find(id);
            return View(category);
        }

        [HttpPost]
        public ActionResult Edit(int id, Category requestCategory)
        {
            Category category = db.Categories.Find(id);

            try
            {

                category.CategoryName = requestCategory.CategoryName;
                db.SaveChanges();
                TempData["message"] = "Categoria a fost modificata!";
                return RedirectToAction("Index");
            }
            catch (Exception e)
            {
                return View(requestCategory);
            }
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            Category category = db.Categories.Find(id);
            db.Categories.Remove(category);
            db.SaveChanges();
            TempData["message"] = "Categoria a fost stearsa";
            return RedirectToAction("Index");
        }
    }
}
