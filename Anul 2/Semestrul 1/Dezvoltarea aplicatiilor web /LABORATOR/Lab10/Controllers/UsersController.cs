using ArticlesApp.Data;
using ArticlesApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace ArticlesApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext db;

        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager
            )
        {
            db = context;

            _userManager = userManager;

            _roleManager = roleManager;
        }
        public IActionResult Index()
        {
            var users = db.Users.OrderBy(u => u.UserName);
                      
            ViewBag.UsersList = users;

            return View();
        }

        public async Task<ActionResult> ShowAsync(string id)
        {
            ApplicationUser? user = db.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }
            else
            {
                var roles = await _userManager.GetRolesAsync(user);
                 
                ViewBag.Roles = roles;

                ViewBag.UserCurent = await _userManager.GetUserAsync(User);

                return View(user);
            } 
        }

        public async Task<ActionResult> Edit(string id)
        {
            ApplicationUser? user = db.Users.Find(id);

            if (user is null)
            {
                return NotFound();
            }

            else
            {
                ViewBag.AllRoles = GetAllRoles();

                var roleNames = await _userManager.GetRolesAsync(user); // Lista de nume de roluri

                // Cautam ID-ul rolului in baza de date
                ViewBag.UserRole = _roleManager.Roles
                                                  .Where(r => roleNames.Contains(r.Name))
                                                  .Select(r => r.Id)
                                                  .First(); // Selectam 1 singur rol

                return View(user);
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> Edit(string id, ApplicationUser newData, [FromForm] string newRole)
        {
            ApplicationUser? user = db.Users.Find(id);

            if(user is null)
            {
                return NotFound();
            }

            else
            {
                
                if (ModelState.IsValid)
                {
                    user.UserName = newData.UserName;
                    user.Email = newData.Email;
                    user.FirstName = newData.FirstName;
                    user.LastName = newData.LastName;
                    user.PhoneNumber = newData.PhoneNumber;

                    // Cautam toate rolurile din baza de date
                    var roles = db.Roles.ToList();

                    foreach (var role in roles)
                    {
                        // Scoatem userul din rolurile anterioare
                        await _userManager.RemoveFromRoleAsync(user, role.Name);
                    }

                    // Adaugam noul rol selectat
                    var roleName = await _roleManager.FindByIdAsync(newRole);
                    await _userManager.AddToRoleAsync(user, roleName.ToString());

                    db.SaveChanges();

                }

                user.AllRoles = GetAllRoles();
                return RedirectToAction("Index");
            }       
        }


        [HttpPost]
        public IActionResult Delete(string id)
        {

            var user = db.ApplicationUsers
                            .Include(u => u.Articles)
                            .Include(u => u.Comments)
                            .Include(u => u.Bookmarks)
                            .Where(u => u.Id == id)
                            .First();

            // Delete user comments
            if (user.Comments.Count > 0)
            {
                foreach (var comment in user.Comments)
                {
                    db.Comments.Remove(comment);
                }
            }

            // Delete user bookmarks
            if (user.Bookmarks.Count > 0)
            {
                foreach (var bookmark in user.Bookmarks)
                {
                    db.Bookmarks.Remove(bookmark);
                }
            }

            // Delete user articles
            if (user.Articles.Count > 0)
            {
                foreach (var article in user.Articles)
                {
                    db.Articles.Remove(article);
                }
            }

            db.ApplicationUsers.Remove(user);

            db.SaveChanges();

            return RedirectToAction("Index");

        }


        [NonAction]
        public IEnumerable<SelectListItem> GetAllRoles()
        {
            var selectList = new List<SelectListItem>();

            var roles = from role in db.Roles
                        select role;

            foreach (var role in roles)
            {
                selectList.Add(new SelectListItem
                {
                    Value = role.Id.ToString(),
                    Text = role.Name.ToString()
                });
            }
            return selectList;
        }
    }
}
