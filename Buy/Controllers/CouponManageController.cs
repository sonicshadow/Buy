﻿using Buy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Buy.Controllers
{
    [Authorize]
    public class CouponManageController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        private void Sidebar()
        {
            ViewBag.Sidebar = "优惠券管理";
        }

        // GET: CouponManage
        [Authorize(Roles = SysRole.CouponManageRead)]
        public ActionResult Index(string filter, Enums.CouponPlatform? platform, int? typeid, DateTime? createTime, int page = 1)
        {
            Sidebar();
            var query = db.Coupons.AsQueryable();
            if (!string.IsNullOrWhiteSpace(filter))
            {
                var filterList = filter.SplitToArray<string>(' ');
                foreach (var item in filterList)
                {
                    query = query.Where(s => s.Name.Contains(item) || s.ProductType.Contains(item) || s.ShopName.Contains(item));
                }
            }
            if (platform.HasValue)
            {
                query = query.Where(s => s.Platform == platform);
            }
            if (typeid.HasValue)
            {
                query = query.Where(s => s.Type.ParentID == typeid.Value || s.TypeID == typeid.Value);
            }
            if (createTime.HasValue)
            {
                query = query.Where(s => s.CreateDateTime.Day == createTime.Value.Day && s.CreateDateTime.Month == createTime.Value.Month);
            }
            var paged = query.OrderByDescending(s => s.ID).ToPagedList(page);
            //未分类数
            ViewBag.NoTypeCount = db.Coupons.Count(s => !s.TypeID.HasValue);
            //分类
            ViewBag.Type = Bll.SystemSettings.CouponType.Where(s => s.ParentID == 0).ToList();
            return View(paged);
        }

        [HttpPost]
        [Authorize(Roles = SysRole.CouponManageDelete)]
        public ActionResult Delete(DateTime date, List<Enums.CouponPlatform> types)
        {
            if (!User.IsInRole(SysRole.CouponManageDelete))
            {
                return Json(Comm.ToJsonResult("NoRole", "没有权限"));
            }
            var delOld = db.Coupons
                .Where(s => types.Contains(s.Platform)
                            && s.CreateDateTime < date)
                .ToList();
            db.Coupons.RemoveRange(delOld);
            db.SaveChanges();
            return Json(Comm.ToJsonResult("Success", "成功"));
        }

        [HttpPost]
        [Authorize(Roles = SysRole.CouponManageDelete)]
        public ActionResult DeleteTicket(string ids)
        {
            if (!User.IsInRole(SysRole.CouponManageDelete))
            {
                return Json(Comm.ToJsonResult("NoRole", "没有权限"));
            }
            var idList = ids.SplitToIntArray();
            if (ids.Count() <= 0)
            {
                return Json(Comm.ToJsonResult("Error", "没有勾选商品"));
            }
            var tickets = db.Coupons.Where(s => idList.Contains(s.ID)).ToList();
            db.Coupons.RemoveRange(tickets);
            db.SaveChanges();
            return Json(Comm.ToJsonResult("Success", "删除成功"));
        }

        [Authorize(Roles = SysRole.CouponManageRead)]
        public ActionResult NoProductType(int page = 1)
        {
            Sidebar();
            var tptlist = db.Coupons
                .Where(s => !s.TypeID.HasValue)
                .GroupBy(s => new { s.ProductType, s.Platform })
                .Select(s => new CouponNotType
                {
                    Type = s.Key.ProductType,
                    Platform = s.Key.Platform,
                    Count = s.Count(),
                })
                .OrderByDescending(s => s.Count)
                .ToPagedList(page);
            return View(tptlist);
        }

        [HttpPost]
        public ActionResult CheckTypes()
        {
            if (!User.IsInRole(SysRole.CouponManageEdit))
            {
                return Json(Comm.ToJsonResult("NoRole", "没有权限"));
            }
            var groupProductType = db.Coupons
                .Where(s => !s.TypeID.HasValue && s.ProductType != null)
                .GroupBy(s => s.ProductType)
                .Select(s => s.Key)
                .ToList();
            int changeCount = 0;
            foreach (var productType in groupProductType)
            {
                var typeID = Bll.Coupons.CheckType(productType, Enums.CouponPlatform.TaoBao);
                if (typeID == null)
                {
                    continue;
                }
                var coupons = db.Coupons.Where(s => !s.TypeID.HasValue
                    && s.ProductType == productType
                    && (s.Platform == Enums.CouponPlatform.TaoBao
                        || s.Platform == Enums.CouponPlatform.TMall)).ToList();
                foreach (var item in coupons)
                {
                    item.TypeID = typeID;
                }
                changeCount += db.SaveChanges();
            }
            return Json(Comm.ToJsonResult("Success", "成功", new { Count = changeCount }));
        }


        //方法
        [AllowCrossSiteJson]
        [HttpPost]
        [AllowAnonymous]
        public ActionResult CleanType()
        {
            int count = db.Coupons.Where(s => (s.Platform == Enums.CouponPlatform.TaoBao ||
            s.Platform == Enums.CouponPlatform.TMall) &&
            s.TypeID.HasValue && s.ProductType != null).Count();
            int totalPage = count / 50 + (count % 50 > 0 ? 1 : 0);
            int changeCount = 0;
            for (int i = 1; i <= totalPage; i++)
            {
                var data = db.Coupons.Where(s => (s.Platform == Enums.CouponPlatform.TaoBao ||
                s.Platform == Enums.CouponPlatform.TMall) &&
                s.TypeID.HasValue && s.ProductType != null)
                    .OrderBy(s => s.ID).ToPagedList(i, 50);
                foreach (var item in data)
                {
                    item.TypeID = null;
                }
                changeCount += db.SaveChanges();
            }
            return Json(Comm.ToJsonResult("Success", "成功"));
        }

        [AllowCrossSiteJson]
        [HttpPost]
        [AllowAnonymous]
        public ActionResult CreateTimeAddDay()
        {
            int count = db.Coupons.Where(s => s.CreateDateTime.Day == DateTime.Now.Day).Count();
            int totalPage = count / 50 + (count % 50 > 0 ? 1 : 0);
            int changeCount = 0;
            for (int i = 1; i <= totalPage; i++)
            {
                var data = db.Coupons.Where(s => s.CreateDateTime.Day == DateTime.Now.Day).OrderBy(s => s.ID).ToPagedList(i, 50);
                foreach (var item in data)
                {
                    item.CreateDateTime = item.CreateDateTime.AddDays(-1);
                }
                changeCount += db.SaveChanges();
            }
            return Json(Comm.ToJsonResult("Success", "cg", changeCount));
        }
    }
}