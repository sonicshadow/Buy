﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Buy.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Buy.Bll
{
    public class Roles : IDisposable
    {
        public Roles()
        {
            _appRoleManager = new RoleManager<ApplicationRole>(new RoleStore<ApplicationRole>(db));
            _appUserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }

        private ApplicationDbContext db = new ApplicationDbContext();

        private RoleManager<ApplicationRole> _appRoleManager;

        private UserManager<ApplicationUser> _appUserManager;

        public void EditUserRole(string userID, IEnumerable<string> roles)
        {
            var old = _appUserManager.GetRoles(userID).ToArray();
            _appUserManager.RemoveFromRoles(userID, old);
            foreach (var item in roles)
            {
                _appUserManager.AddToRole(userID, item);
            }
        }

        public void EditUserRoleByGroupID(string userID, int groupID)
        {
            var roles = db.RoleGroups.FirstOrDefault(s => s.ID == groupID).Roles.SplitToArray<string>();
            var old = _appUserManager.GetRoles(userID).ToArray();
            _appUserManager.RemoveFromRoles(userID, old);
            foreach (var item in roles)
            {
                _appUserManager.AddToRole(userID, item);
            }
        }

        public void InitNormalUserRole(string userID)
        {
            EditUserRole(userID, new string[] { });
        }

        public bool IsInRole(string userID, string role)
        {
            return _appUserManager.IsInRole(userID, role);
        }

        public IEnumerable<string> GetRoles(string userID)
        {
            return _appUserManager.GetRoles(userID);
        }

        public void Init()
        {
            List<ApplicationRole> roles = new List<ApplicationRole>();
            Action<string, string, string> addUserRole = (name, gourp, desc) =>
             {
                 roles.Add(new ApplicationRole
                 {
                     Description = desc,
                     Group = gourp,
                     Name = name,
                     Type = Enums.RoleType.Proxy
                 });
             };
            Action<string, string, string> addSystemRole = (name, gourp, desc) =>
            {
                roles.Add(new ApplicationRole
                {
                    Description = desc,
                    Group = gourp,
                    Name = name,
                    Type = Enums.RoleType.System
                });
            };
            #region 用户权限
            addUserRole(SysRole.UserTakeChildProxy, "代理权限", "收二级代理");

            #endregion
            #region 后台权限

            addSystemRole(SysRole.UserManageRead, "用户管理", "代理用户查看");
            addSystemRole(SysRole.UserManageCreate, "用户管理", "代理用户添加");
            addSystemRole(SysRole.UserManageDelete, "用户管理", "代理用户删除");
            addSystemRole(SysRole.UserManageEdit, "用户管理", "代理用户编辑");
            addSystemRole(SysRole.UserManageUpdate, "用户管理", "升级代理");
            addSystemRole(SysRole.UserManageEnableTakeChildProxy, "用户管理", "授权代理收子代理");

            addSystemRole(SysRole.AdminManageRead, "管理员管理", "管理员查看");
            addSystemRole(SysRole.AdminManageCreate, "管理员管理", "管理员添加");
            addSystemRole(SysRole.AdminManageDelete, "管理员管理", "管理员删除");
            addSystemRole(SysRole.AdminManageEdit, "管理员管理", "管理员编辑");

            addSystemRole(SysRole.CouponTypeManageRead, "优惠券类型管理", "优惠券类型查看");
            addSystemRole(SysRole.CouponTypeManageCreate, "优惠券类型管理", "优惠券类型添加");
            addSystemRole(SysRole.CouponTypeManageEdit, "优惠券类型管理", "优惠券类型编辑");
            addSystemRole(SysRole.CouponTypeManageDelete, "优惠券类型管理", "优惠券类型删除");

            addSystemRole(SysRole.CouponManageRead, "优惠券管理", "优惠券管理查看");
            addSystemRole(SysRole.CouponManageCreate, "优惠券管理", "优惠券管理添加");
            addSystemRole(SysRole.CouponManageEdit, "优惠券管理", "优惠券管理编辑");
            addSystemRole(SysRole.CouponManageDelete, "优惠券管理", "优惠券管理删除");

            addSystemRole(SysRole.RegistrationCodeManageCreate, "注册码管理", "注册码管理添加");
            addSystemRole(SysRole.RegistrationCodeManageDelete, "注册码管理", "注册码管理删除");
            addSystemRole(SysRole.RegistrationCodeManageEdit, "注册码管理", "注册码管理编辑");
            addSystemRole(SysRole.RegistrationCodeManageRead, "注册码管理", "注册码管理查看");

            addSystemRole(SysRole.ShopManageCreate, "商家管理", "商家管理添加");
            addSystemRole(SysRole.ShopManageDelete, "商家管理", "商家管理删除");
            addSystemRole(SysRole.ShopManageEdit, "商家管理", "商家管理编辑");
            addSystemRole(SysRole.ShopManageRead, "商家管理", "商家管理查看");
            

            addSystemRole(SysRole.LocalCouponManageCreate, "本地券管理", "本地券管理添加");
            addSystemRole(SysRole.LocalCouponManageDelete, "本地券管理", "本地券管理删除");
            addSystemRole(SysRole.LocalCouponManageEdit, "本地券管理", "本地券管理编辑");
            addSystemRole(SysRole.LocalCouponManageRead, "本地券管理", "本地券管理查看");

            addSystemRole(SysRole.RoleManageRead, "权限管理", "权限管理查看");
            addSystemRole(SysRole.RoleManageCreate, "权限管理", "权限管理创建");
            addSystemRole(SysRole.RoleManageEdit, "权限管理", "权限管理编辑");
            addSystemRole(SysRole.RoleManageDelete, "权限管理", "权限管理删除");

            addSystemRole(SysRole.BannerManageRead, "Banner管理", "Banner管理查看");
            addSystemRole(SysRole.BannerManageCreate, "Banner管理", "Banner管理创建");
            addSystemRole(SysRole.BannerManageEdit, "Banner管理", "Banner管理编辑");
            addSystemRole(SysRole.BannerManageDelete, "Banner管理", "Banner管理删除");

            addSystemRole(SysRole.ClassifyManageRead, "分类管理", "分类管理查看");
            addSystemRole(SysRole.ClassifyManageCreate, "分类管理", "分类管理创建");
            addSystemRole(SysRole.ClassifyManageEdit, "分类管理", "分类管理编辑");
            addSystemRole(SysRole.ClassifyManageDelete, "分类管理", "分类管理删除");

            addSystemRole(SysRole.CustomerServiceManageRead, "客服设置", "客服管理查看");
            addSystemRole(SysRole.CustomerServiceManageCreate, "客服设置", "客服管理创建");
            addSystemRole(SysRole.CustomerServiceManageEdit, "客服设置", "客服管理编辑");
            addSystemRole(SysRole.CustomerServiceManageDelete, "客服设置", "客服管理删除");

            addSystemRole(SysRole.UpdateLogManageRead, "版本管理", "版本管理查看");
            addSystemRole(SysRole.UpdateLogManageCreate, "版本管理", "版本管理创建");
            addSystemRole(SysRole.UpdateLogManageEdit, "版本管理", "版本管理编辑");
            addSystemRole(SysRole.UpdateLogManageDelete, "版本管理", "版本管理删除");

            #endregion

            foreach (var item in roles)
            {
                if (_appRoleManager.FindByName(item.Name) == null)
                {
                    _appRoleManager.Create(item);
                }
            }
        }

        public void Dispose()
        {
            db.Dispose();
        }
    }
}