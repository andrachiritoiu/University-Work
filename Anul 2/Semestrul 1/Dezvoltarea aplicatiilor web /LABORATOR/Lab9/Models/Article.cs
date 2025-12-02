
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
        [StringLength(100, ErrorMessage = "Titlul nu poate avea mai mult de 100 de caractere")]
        [MinLength(5, ErrorMessage = "Titlul trebuie sa aiba mai mult de 5 caractere")]
        public string Title { get; set; }

        //[Max200CharsValidation] - Validare custom folosind atribute personalizate
        [Required(ErrorMessage = "Continutul articolului este obligatoriu")]

        public string Content { get; set; }

        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Categoria este obligatorie")]
        public int? CategoryId { get; set; }


        //propietate de navigare
        //un articol aprtine unei categorii
        public virtual Category? Category { get; set; }

        //Pasul 6: useri si roluri
        //o cheie externa - un articol este postat de catre un user
        public string? UserId { get; set; }


        //proprietate de navigare
        //un articol este postat de un user
        public virtual ApplicationUser? User { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        [NotMapped]
        public IEnumerable<SelectListItem> Categ { get; set; } = Enumerable.Empty<SelectListItem>();

        /*
         * 
         // Validare pe serviciu (IValidatableObject)
         
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if(Content.Length < 200 && Date > DateTime.Parse("12/24/2024"))
          //  DateTime.ParseExact("24/12/2024", "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
            {
                yield return ValidationResult.Success;
            }

            yield return new ValidationResult("Continutul trebuie sa fie de maxim 200 de caractere");
        }

        */

    }
}
