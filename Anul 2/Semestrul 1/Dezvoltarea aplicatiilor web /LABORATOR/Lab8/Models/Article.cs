using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticlesApp.Models
{
    public class Article
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Titlul este obligatoriu")]
        [StringLength(100,ErrorMessage ="Titlul are maxim 100 de careactere")]
        [MinLength(5,ErrorMessage ="Titlul trebuie sa aiba minim 5 caractere")]
        public string Title { get; set; } 

        [Required(ErrorMessage = "Continutul articolului este obligatoriu")]
        public string Content { get; set; } 

        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Categoria este obligatorie")]
        public int CategoryId { get; set; }

        public virtual Category? Category { get; set; }

        public virtual ICollection<Comment>? Comments { get; set; }

        [NotMapped]
        public IEnumerable<SelectListItem>? Categ { get; set; }


    }
}
