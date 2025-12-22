using ExercitiuLaborator12.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Membership
{
    [Key]
    public int Id { get; set; }


    [Required(ErrorMessage = "Titlul abonamentului este obligatoriu")] 
    public string Titlu { get; set; }


    [Required(ErrorMessage = "Valoarea abonamentului este obligatorie")]
    [Range(1, int.MaxValue, ErrorMessage = "Valoarea trebuie să fie un număr întreg pozitiv")] 
    public int Valoare { get; set; }


    [Required(ErrorMessage = "Data emiterii abonamentului este obligatorie")]
    public DateTime DataEmitere { get; set; }


    [Required(ErrorMessage = "Selectarea sălii de sport este obligatorie")]
    public int GymId { get; set; } 


    [ForeignKey("GymId")]
    public virtual Gym? Gym { get; set; }
}