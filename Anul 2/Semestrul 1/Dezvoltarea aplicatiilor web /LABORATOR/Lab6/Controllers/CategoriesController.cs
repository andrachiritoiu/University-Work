using ArticlesAppLab6.Data;
using ArticlesApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ArticlesAppLab6.Controllers
{
    public class CategoriesController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext db = context;

        public IActionResult Index()
        {
            var categories = db.Categories
                               .Include(c => c.Articles)
                               .OrderBy(c => c.CategoryName)
                               .ToList();

            return View(categories);
        }

        public IActionResult Show(int id)
        {
            Category? category = db.Categories
                                   .Include(c => c.Articles)
                                   .ThenInclude(a => a.Comments)
                                   .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        public IActionResult New()
        {
            return View(new Category());
        }

        [HttpPost]
        public IActionResult New(Category category)
        {
            if (!ModelState.IsValid)
            {
                return View(category);
            }

            db.Categories.Add(category);
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        public IActionResult Edit(int id)
        {
            Category? category = db.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        [HttpPost]
        public IActionResult Edit(int id, Category requestCategory)
        {
            Category? category = db.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return View(requestCategory);
            }

            category.CategoryName = requestCategory.CategoryName;

            db.SaveChanges();

            return RedirectToAction("Show", new { id });
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            Category? category = db.Categories
                                   .Include(c => c.Articles)
                                   .ThenInclude(a => a.Comments)
                                   .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            foreach (var article in category.Articles.ToList())
            {
                if (article.Comments.Any())
                {
                    db.Comments.RemoveRange(article.Comments);
                }
                db.Articles.Remove(article);
            }

            db.Categories.Remove(category);
            db.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}
