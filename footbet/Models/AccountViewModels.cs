using System.ComponentModel.DataAnnotations;

namespace Footbet.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Brukernavn")]
        public string UserName { get; set; }
    }

    public class ManageUserViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Gammelt passord")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Passordet må bestå av minst 6 tegn", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Nytt passord")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Bekreft nytt passord")]
        [Compare("NewPassword", ErrorMessage = "Passordene er ikke like")]
        public string ConfirmPassword { get; set; }
    }

    public class AdminChangePasswordViewModel
    {
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Brukernavn")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Passordet må bestå av minst 6 tegn", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Nytt passord")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Bekreft nytt passord")]
        [Compare("NewPassword", ErrorMessage = "Passordene er ikke like")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "Brukernavn")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Passord")]
        public string Password { get; set; }

        [Display(Name = "Husk meg?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Vennligst fyll inn et brukernavn")]
        [Display(Name = "Brukernavn")]
        public string UserName { get; set; }
        
        [Required(ErrorMessage = "Vennligst fyll inn navn")]
        [Display(Name = "Navn")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Vennligst fyll inn passord")]
        [StringLength(100, ErrorMessage = "Passordet {0} må minst ha lengde {2}!", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Passord")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Bekreft passord")]
        [Compare("Password", ErrorMessage = "Passordene er ikke like!")]
        public string ConfirmPassword { get; set; }
    }
}
