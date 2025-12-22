using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ExercitiuLaborator12.Models;
public class MembershipsController : Controller
{
    private readonly AppDbContext _context;

    public MembershipsController(AppDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var memberships = _context.Memberships.Include(m => m.Gym).ToList();

        if (TempData["Message"] != null)
        {
            ViewBag.Message = TempData["Message"];
        }

        return View(memberships);
    }

    public IActionResult New()
    {
        SetupGymDropdown();
        return View();
    }

    [HttpPost]
    public IActionResult New(Membership membership)
    {
        membership.DataEmitere = DateTime.Now;

        if (ModelState.IsValid)
        {
            _context.Memberships.Add(membership);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        SetupGymDropdown();
        return View(membership);
    }

    public IActionResult Edit(int id)
    {
        var membership = _context.Memberships.Find(id);
        if (membership == null)
        {
            return NotFound();
        }

        SetupGymDropdown();
        return View(membership);
    }

    [HttpPost]
    public IActionResult Edit(Membership membership)
    {
        if (ModelState.IsValid)
        {
            var existingMembership = _context.Memberships.Find(membership.Id);

            if (existingMembership != null)
            {
                existingMembership.Titlu = membership.Titlu;
                existingMembership.Valoare = membership.Valoare;
                existingMembership.GymId = membership.GymId;


                _context.SaveChanges();
                return RedirectToAction("Index");
            }
        }

        SetupGymDropdown();
        return View(membership);
    }

 

    [HttpPost]
    public IActionResult Delete(int id)
    {
        var membership = _context.Memberships.Find(id);
        if (membership != null)
        {
            _context.Memberships.Remove(membership);
            _context.SaveChanges();
            TempData["Message"] = "Abonamentul a fost șters cu succes!"; 
        }
        return RedirectToAction("Index");
    }

    private void SetupGymDropdown()
    {
        ViewBag.Gyms = new SelectList(_context.Gyms, "Id", "Nume");
    }
}