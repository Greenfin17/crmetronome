using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using crmetronomeAPI.Models;

namespace crmetronomeAPI.DataAccess
{
    public class UserRepository
    {
        readonly string _connectionString;

        public UserRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<User> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var users = db.Query<User>(@"SELECT * From Users");
            return users;
        }

        internal User GetUserById(Guid userId)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Users
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<User>(sql, new { Id = userId });
            return result;
        }

        internal User GetUserByFirebaseUID(string firebaseUID)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Users
                        WHERE FireBaseUID = @FireBaseUID";
            var result = db.QueryFirstOrDefault<User>(sql, new { FireBaseUID = firebaseUID });
            return result;
        }

        internal bool UserExists(Guid userId)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Users
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<User>(sql, new { Id = userId });
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddUser(User userObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"IF NOT EXISTS ( SELECT Id FROM Users WHERE FireBaseUID = @FireBaseUID)
                        INSERT INTO Users (FireBaseUID, FirstName, LastName, EmailAddress, ProfilePicURL, Role)
                        OUTPUT Inserted.Id
                        VALUES
                       (@FirebaseUID, @FirstName, @LastName, @EmailAddress, @ProfilePicURL, @Role)";
            id = db.ExecuteScalar<Guid>(sql, userObj);
            if (!id.Equals(Guid.Empty))
            {
                userObj.Id = id;
            }
            return id;
        }

        internal User UpdateUser(Guid userId, User userObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Users
                            SET Id = @Id,
                            FirebaseUID = @FirebaseUID,
                            FirstName = @FirstName,
                            LastName = @LastName,
                            EmailAddress = @EmailAddress,
                            ProfilePicURL = @ProfilePicURL
                            Role = @Role
                        OUTPUT Inserted.*
                        WHERE Id = @Id";
            var parameters = new
            {
                Id = userId,
                FirebaseUID = userObj.FirebaseUID,
                FirstName = userObj.FirstName,
                LastName = userObj.LastName,
                EmailAddress = userObj.EmailAddress,
                ProfilePicURL = userObj.ProfilePicUrl,
                Role = userObj.Role
            };

            var result = db.QuerySingleOrDefault<User>(sql, parameters);
            return result;
        }

        internal bool DeleteUser(Guid userId)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Users 
                        OUTPUT Deleted.Id
                        WHERE Id = @Id";
            var parameter = new
            {
                Id = userId
            };
            var result = db.Query(sql, parameter);
            if (result.Any())
            {
                returnVal = true;
            }
            return returnVal;
        }
    }
}
