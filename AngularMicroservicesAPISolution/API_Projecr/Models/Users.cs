namespace API_Projecr.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? EmailAddress { get; set; }
        public int CustomerId { get; set; }

        public string? ContactNo { get; set; }
        public string? Password { get; set; } 
        public bool IsActive { get; set; }
        public bool IsFirstTimeLogin { get; set; }

        public string? Token { get; set; }
    }
}
