using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_Projecr.Data;
using API_Projecr.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net;
using System.Net.Mail;
using OtpNet;

namespace API_Projecr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Users : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public Users(ApplicationDbContext context)
        {
            _context = context;
        }
        private const string SecretKey = "Ht43mkcsrmvSSd";

        public static string GenerateToken()
        {
            var totp = new Totp(Base32Encoding.ToBytes(SecretKey));
            return totp.ComputeTotp();
        }

        public static bool VerifyToken(string token)
        {
            var totp = new Totp(Base32Encoding.ToBytes(SecretKey));
            return totp.VerifyTotp(token, out _, VerificationWindow.RfcSpecifiedNetworkDelay);
        }

        private void SendEmail(string SendTo,string code)
        {
            try
            {
                var fromAddress = new MailAddress("motanfaisal67@gmail.com", "Faisal");
                var toAddress = new MailAddress(SendTo, "To Faisal");
                const string fromPassword = "enpighglqvxevprn";
                const string subject = "One time token for login";
                string body = $"Token:{code}";

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential(fromAddress.Address, fromPassword),
                    Timeout = 20000
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    smtp.Send(message);
                }
            }
            catch (Exception ex)
            {

             }
        }

        [HttpGet("En")]
        public string En(string message)
        {
            string encryptedMessage = Utility.EncryptString(Utility.Key, message);
            return encryptedMessage;
        }

        [HttpGet("De")]
        public string De(string message)
        {
            string encryptedMessage = Utility.DecryptString(Utility.Key, message);
            return encryptedMessage;
        }

        [HttpPost("TokenValidate")]
        public async Task<ActionResult> TokenValidate(Models.User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("Invalid token");
                }

                Models.User ObjUser = _context.Users.Where(o => o.EmailAddress == user.EmailAddress).FirstOrDefault();

                if (ObjUser != null)
                {

                    if (ObjUser.Token.Equals(user.Token))
                    {
                        return Ok(true);
                    }
                    else
                    {
                        return BadRequest("Invalid token");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

            return Ok();
        }


        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword(Models.User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("User object is null");
                }

                Models.User ObjUser = _context.Users.Where(o => o.EmailAddress == user.EmailAddress).FirstOrDefault();

                if (ObjUser != null)
                {
                    string EnPass = Utility.EncryptString(Utility.Key, user.Password);

                    ObjUser.Password = EnPass;
                    ObjUser.IsFirstTimeLogin = false;
                    _context.SaveChanges();
                    return Ok(true);
                }


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

            return Ok();
        }


        [HttpPost("LoginUser")]
        public async Task<ActionResult> LoginUser(Models.User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("User object is null");
                }

                Models.User ObjUser = _context.Users.Where(o => o.EmailAddress == user.EmailAddress).FirstOrDefault();

                if (ObjUser != null)
                {
                    string dePass = Utility.DecryptString(Utility.Key, ObjUser.Password);
                    if (!dePass.Equals(user.Password))
                    {
                        return BadRequest("Invalid username or password");

                    }


                    if (ObjUser.IsFirstTimeLogin)
                    {
                        return Ok(ObjUser);
                    }
                    else
                    {
                        string token = GenerateToken();
                        ObjUser.Token = token;
                        _context.SaveChanges();

                        SendEmail(ObjUser.EmailAddress, token);
                        return Ok(true);

                    }
                }
                else
                {
                    return BadRequest("Invalid username or password");
                }

                //GenerateToken();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

            return Ok();
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
       {
          if (_context.Users == null)
          {
              return NotFound();
          }
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.Users == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Users'  is null.");
          }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.UserId == id)).GetValueOrDefault();
        }
    }
}
