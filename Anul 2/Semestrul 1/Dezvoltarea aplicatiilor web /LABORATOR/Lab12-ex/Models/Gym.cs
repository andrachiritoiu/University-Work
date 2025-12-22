using System.ComponentModel.DataAnnotations;

public class Gym
{
    [Key]
    public int Id { get; set; } 
    [Required]
    public string Nume { get; set; } 

    

    public virtual ICollection<Membership> Memberships { get; set; }
}