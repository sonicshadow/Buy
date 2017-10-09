﻿using Buy.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Buy.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        private string UserID
        {
            get
            {
                return User.Identity.GetUserId();
            }
        }

        // GET: User
        public ActionResult Index()
        {
            var user = db.Users.FirstOrDefault(s => s.Id == UserID);
            return View(user);
        }

        public ActionResult Edit()
        {
            var user = db.Users.FirstOrDefault(s => s.Id == UserID);
            return View(user);
        }


        [AllowAnonymous]
        public ActionResult CustomerService()
        {
            var model = new SystemSetting()
            {
                Value = Bll.SystemSettings.CustomerService,
            };
            return View(model);
        }

        [AllowCrossSiteJson]
        [AllowAnonymous]
        [HttpPost]
        public ActionResult Edit(string userID, string nickName, string avatar)
        {
            var user = db.Users.FirstOrDefault(s => s.Id == userID);
            if (user == null)
            {
                return Json(Comm.ToJsonResult("Erroe", "没有这个用户"));
            }
            user.NickName = nickName;
            user.Avatar = avatar;
            db.SaveChanges();
            return Json(Comm.ToJsonResult("Success", "修改成功"));
        }

        [AllowCrossSiteJson]
        [AllowAnonymous]
        [HttpGet]
        public ActionResult GetCustomerService()
        {
            return Json(Comm.ToJsonResult("Success", "成功", new
            {
                Data = Url.ContentFull(Url.Action("CustomerService", "User", new { layout = false })),
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AllowAnonymous]
        [AllowCrossSiteJson]
        public ActionResult GetChild(string userId, int page = 1)
        {
            var users = db.Users.Where(s => s.ParentUserID == userId).OrderBy(s => s.RegisterDateTime).ToPagedList(page);
            var data = users.Select(s => new
            {
                s.NickName,
                s.Id,
                s.PhoneNumber,
                s.UserName,
                s.UserType,
                Avatar = Comm.ResizeImage(s.Avatar, image: null),
            });
            return Json(Comm.ToJsonResultForPagedList(users, data), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AllowAnonymous]
        [AllowCrossSiteJson]
        public ActionResult GetCode(string userId, int page = 1)
        {
            var codes = (from r in db.RegistrationCodes
                         where r.OwnUser == userId
                         join u in db.Users
                         on r.UseUser equals u.Id
                         into c
                         select new { code = r, user = c.FirstOrDefault() })
                         .OrderBy(s => s.code.CreateTime)
                         .ToPagedList(page);
            var data = codes.Select(s => new
            {
                s.code.ID,
                s.code.Code,
                CreateTime = s.code.CreateTime.ToString("yyyy-MM-dd"),
                UseTime = s.code.UseTime.HasValue ? s.code.UseTime.Value.ToString("yyyy-MM-dd") : null,
                s.code.UseUser,
                User = s.user,
                UseEndDateTime = s.code.UseEndDateTime.HasValue ? s.code.UseEndDateTime.Value.ToString("yyyy-MM-dd") : null,
                ActiveEndDateTime = s.code.ActiveEndDateTime.HasValue ? s.code.ActiveEndDateTime.Value.ToString("yyyy-MM-dd") : null,
            });
            return Json(Comm.ToJsonResultForPagedList(codes, data), JsonRequestBehavior.AllowGet);
        }

    }
}