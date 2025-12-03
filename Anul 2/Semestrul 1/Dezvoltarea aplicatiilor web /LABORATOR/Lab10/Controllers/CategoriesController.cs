using ArticlesApp.Data;
using ArticlesApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// In unele metode sunt necesare verificari suplimentare (daca exista id-ul cautat, daca
// exista obiectul, etc., la fel cum am procedat in ArticlesController)

namespace ArticlesApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoriesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) : Controller
    {
        private readonly ApplicationDbContext db = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;


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
            Category? category = db.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        public ActionResult New()
        {
            return View();
        }

        [HttpPost]
        public ActionResult New(Category cat)
        {
            if (ModelState.IsValid)
            {
                db.Categories.Add(cat);
                db.SaveChanges();
                TempData["message"] = "Categoria a fost adaugata";
                return RedirectToAction("Index");
            }

            else
            {
                return View(cat);
            }
        }

        public ActionResult Edit(int id)
        {
            Category? category = db.Categories.Find(id);

            if(category is null)
            {
                return NotFound();
            }

            return View(category);
        }

        [HttpPost]
        public ActionResult Edit(int id, Category requestCategory)
        {
            Category? category = db.Categories.Find(id);

            if (category is null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                category.CategoryName = requestCategory.CategoryName;
                db.SaveChanges();
                TempData["message"] = "Categoria a fost modificata!";
                return RedirectToAction("Index");
            }
            else
            {
                return View(requestCategory);
            }
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {

            // Category category = db.Categories.Find(id);

            Category? category = db.Categories.Include(c => c.Articles)
                                                .ThenInclude(a => a.Comments )
                                             .Where(c => c.Id == id)
                                             .FirstOrDefault();
            if(category is null)
            {
                return NotFound();
            }

            else
            {
                db.Categories.Remove(category);
                db.SaveChanges();
                TempData["message"] = "Categoria a fost stearsa";    
                return RedirectToAction("Index");
            }
               

            /*

            //  Varianta in care nu se poate sterge categoria daca are articole asociate

            Category? category = db.Categories
                                   .Include(c => c.Articles) 
                                   .FirstOrDefault(c => c.Id == id);

            if (category is null)

            {
                return NotFound();
            }

            else
            {
                if (category.Articles?.Any() == true)
                {
                    TempData["message"] = "Nu poti sterge categoria cat timp are articole asociate";
                    return RedirectToAction("Index");
                }

                db.Categories.Remove(category);
                db.SaveChanges();
                TempData["message"] = "Categoria a fost stearsa";
                return RedirectToAction("Index");
            }

            */

        }
    }
}


