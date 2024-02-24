using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace API_Projecr
{
    public static class Utility
    {
        public static string Key = "sblw-3hn8-sqoy19";
        public static string EncryptString(string key, string plainInput)
        {
            byte[] iv = new byte[16];
            byte[] array;
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainInput);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }

        public static string DecryptString(string key, string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }
        private static byte[] AdjustTripleDesKeySize(byte[] key)
        {
            if (key.Length == 16)
                return key; // Key size is already 128 bits (16 bytes)
            else if (key.Length < 16)
            {
                // Pad key with zero bytes if it is less than 128 bits
                byte[] adjustedKey = new byte[16];
                Buffer.BlockCopy(key, 0, adjustedKey, 0, key.Length);
                return adjustedKey;
            }
            else
            {
                // Truncate key if it is more than 128 bits
                byte[] adjustedKey = new byte[16];
                Buffer.BlockCopy(key, 0, adjustedKey, 0, 16);
                return adjustedKey;
            }
        }
    }

}
