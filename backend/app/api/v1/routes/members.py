from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.core.deps import get_current_anggota, admin_required
from app.models.anggota import Anggota
from app.models.angsuran import StatusAngsuran
from app.schemas.anggota import AnggotaResponse, AnggotaUpdate, AnggotaCreate
from typing import List
from datetime import datetime, timezone
from app.core.security import get_password_hash
from app.core.logger import logger

router = APIRouter()

@router.post("/create", response_model=AnggotaResponse)
def create_member(
    member: AnggotaCreate,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Create new member (admin only)"""
    logger.info(f"[Members] Create attempt: email={member.email}, nama={member.nama}")
    try:
        # Check if email exists
        if db.query(Anggota).filter(Anggota.email == member.email).first():
            logger.warning(f"[Members] Create failed: email already exists - {member.email}")
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        
        new_member = Anggota(
            nama=member.nama,
            email=member.email,
            no_wa=member.no_wa,
            password_hash=get_password_hash(member.password),
            role="anggota",
            status="Aktif"
        )
        db.add(new_member)
        db.commit()
        db.refresh(new_member)
        logger.info(f"[Members] Created: id={new_member.id}, email={new_member.email}")
        return new_member
    except Exception as e:
        logger.error(f"[Members] Create failed: {str(e)}")
        raise

@router.delete("/{anggota_id}")
def delete_member(
    anggota_id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Delete member (admin only)"""
    logger.info(f"[Members] Delete attempt: id={anggota_id}")
    try:
        member = db.query(Anggota).filter(Anggota.id == anggota_id).first()
        if not member:
            logger.warning(f"[Members] Delete failed: not found - id={anggota_id}")
            raise HTTPException(status_code=404, detail="Anggota tidak ditemukan")
        
        # Prevent deleting self
        if member.id == admin.id:
            logger.warning(f"[Members] Delete failed: attempt to delete self - id={admin.id}")
            raise HTTPException(status_code=400, detail="Tidak bisa menghapus akun sendiri")
        
        db.delete(member)
        db.commit()
        logger.info(f"[Members] Deleted: id={anggota_id}")
        return {"status": "success", "message": "Anggota dihapus"}
    except Exception as e:
        logger.error(f"[Members] Delete failed: {str(e)}")
        raise

@router.get("/list", response_model=List[AnggotaResponse])
def get_all_members(
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List all members (admin) or self (regular user)"""
    logger.info(f"[Members] List: user_id={current_anggota.id}, role={current_anggota.role}")
    try:
        if current_anggota.role == "admin":
            members = db.query(Anggota).all()
            logger.info(f"[Members] Listed: count={len(members)} (admin view)")
            return members
        else:
            logger.info(f"[Members] Listed: self only (user view)")
            return [current_anggota]
    except Exception as e:
        logger.error(f"[Members] List failed: {str(e)}")
        raise

@router.get("/me", response_model=AnggotaResponse)
def get_me(current_anggota: Anggota = Depends(get_current_anggota)):
    """Get current user profile"""
    logger.info(f"[Members] GetMe: user_id={current_anggota.id}, email={current_anggota.email}")
    try:
        return current_anggota
    except Exception as e:
        logger.error(f"[Members] GetMe failed: {str(e)}")
        raise

@router.get("/me/dashboard")
def get_my_dashboard(
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """Get current user dashboard data"""
    logger.info(f"[Members] GetMyDashboard: user_id={current_anggota.id}")
    try:
        # Import services (not imported at top level to avoid circular imports)
        from app.services import simpanan as simpanan_service, pinjaman as pinjaman_service, angsuran as angsuran_service, funding as funding_service
        
        # 1. Calculate saldo (current saldo = latest saldo_setelah)
        simpanan_list = simpanan_service.get_simpanan_list(db, current_anggota.id)
        # FIX: Take LATEST saldo_setelah (not sum all!) - order by date DESC to get most recent
        if simpanan_list:
            # Sort by id DESC (latest record) to ensure we get the most recent saldo_setelah
            simpanan_list_sorted = sorted(simpanan_list, key=lambda x: x.id, reverse=True)
            total_simpanan = simpanan_list_sorted[0].saldo_setelah
        else:
            total_simpanan = 0.0
        logger.info(f"[Members] GetMyDashboard: saldo={total_simpanan}")
        
        # 2. Active pinjaman
        pinjaman_list = pinjaman_service.get_pinjaman_list(db, current_anggota.id)
        active_pinjaman = [p for p in pinjaman_list if p.status != "Lunas"]
        total_pinjaman_aktif = len(active_pinjaman)
        logger.info(f"[Members] GetMyDashboard: active_pinjaman={total_pinjaman_aktif}")
        
        # 3. Angsuran status
        angsuran_list = angsuran_service.get_angsuran_list(db, anggota_id=current_anggota.id)
        overdue = [a for a in angsuran_list if a.status == "Belum Bayar" and a.tanggal_jatuh_tempo and a.tanggal_jatuh_tempo < datetime.now(timezone.utc).replace(tzinfo=None)]
        upcoming = [a for a in angsuran_list if a.status == "Belum Bayar" and a.tanggal_jatuh_tempo and a.tanggal_jatuh_tempo >= datetime.now(timezone.utc).replace(tzinfo=None)]
        
        # 4. Funding contributions
        funding_list = funding_service.get_funding_list(db, current_anggota.id)
        total_funding = sum(f.nominal for f in funding_list if f.status == "Disetujui")
        logger.info(f"[Members] GetMyDashboard: total_funding={total_funding}")
        
        return {
            "saldo": total_simpanan,
            "pinjaman_aktif": total_pinjaman_aktif,
            "angsuran_belum_bayar": len([a for a in angsuran_list if a.status == "Belum Bayar"]),
            "angsuran_overdue": len(overdue),
            "angsuran_upcoming": len(upcoming),
            "total_funding": total_funding,
            "recent_simpanan": simpanan_list[:5],
            "recent_pinjaman": pinjaman_list[:5],
            "recent_funding": funding_list[:5]
        }
    except Exception as e:
        logger.error(f"[Members] GetMyDashboard failed: {str(e)}")
        raise

@router.get("/admin/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Admin dashboard - aggregate stats for ALL members"""
    logger.info("[Members] GetAdminDashboard: Started")
    try:
        from app.services import simpanan as simpanan_service, pinjaman as pinjaman_service, angsuran as angsuran_service, funding as funding_service
        from app.models.simpanan import Simpanan
        from app.models.pinjaman import Pinjaman, StatusPinjaman
        
        # 1. Total saldo semua anggota (sum of latest saldo_setelah per anggota)
        # Alternatively, sum all simpanan.nominal
        total_saldo = db.query(func.sum(Simpanan.nominal)).scalar() or 0.0
        logger.info(f"[Members] GetAdminDashboard: total_saldo={total_saldo}")
        
        # 2. Total pinjaman stats (outstanding amount, not count)
        all_pinjaman = pinjaman_service.get_pinjaman_list(db)
        logger.info(f"[Members] GetAdminDashboard: Got {len(all_pinjaman) if all_pinjaman else 0} pinjaman")
        
        total_pinjaman_aktif = 0.0
        total_pinjaman_diajukan = 0.0
        total_pinjaman_ditolak = 0.0
        total_pinjaman_bermasalah = 0.0
        
        for p in all_pinjaman:
            try:
                nominal = float(p.nominal) if p.nominal else 0.0
                status = str(p.status)
                if status != "Lunas":
                    total_pinjaman_aktif += nominal
                if status == "Diajukan":
                    total_pinjaman_diajukan += nominal
                if status == "Ditolak":
                    total_pinjaman_ditolak += nominal
                if status in ["Macet", "Ditolak"]:
                    total_pinjaman_bermasalah += nominal
            except Exception as e:
                logger.error(f"[Members] Error processing pinjaman: {str(e)}")
        
        logger.info(f"[Members] GetAdminDashboard: total_pinjaman_aktif={total_pinjaman_aktif}")
        
        # 3. Budget persiapan (total Diajukan loans - money that will go out if approved)
        budget_persiapan = 0.0
        for p in all_pinjaman:
            try:
                if str(p.status) == "Diajukan":
                    budget_persiapan += float(p.nominal) if p.nominal else 0.0
            except Exception as e:
                logger.error(f"[Members] Error processing budget: {str(e)}")
        
        # 4. Total angsuran belum bayar (SUM of amounts, not count)
        all_angsuran = angsuran_service.get_angsuran_list(db)
        logger.info(f"[Members] GetAdminDashboard: Got {len(all_angsuran)} angsuran from service")
        total_angsuran_belum_bayar = 0.0
        belum_bayar_count = 0
        for a in all_angsuran:
            try:
                logger.info(f"[Members] Angsuran: type_status={type(a.status)}, status={a.status}, value={a.status.value if hasattr(a.status, 'value') else 'NO VALUE'}")
                if a.status == StatusAngsuran.BELUM_BAYAR or str(a.status) == "Belum Bayar":
                    belum_bayar_count += 1
                    total_angsuran_belum_bayar += float(a.nominal_angsuran) if a.nominal_angsuran else 0.0
            except Exception as e:
                logger.error(f"[Members] Error processing angsuran: {str(e)}")
        logger.info(f"[Members] GetAdminDashboard: belum_bayar_count={belum_bayar_count}, total_angsuran_belum_bayar={total_angsuran_belum_bayar}")
        logger.info(f"[Members] GetAdminDashboard: total_angsuran_belum_bayar={total_angsuran_belum_bayar}")
        
        # 5. Calculate NPL (Non-Performing Loans) percentage - BUSINESS LOGIC FIX
        # NPL = (Total nominal angsuran "Belum Bayar" / Total nominal pinjaman aktif) * 100%
        # This is the correct formula per BUSINESS_LOGIC_AUDIT.md B2
        npl_percentage = 0.0
        if total_pinjaman_aktif > 0:
            npl_percentage = (total_angsuran_belum_bayar / total_pinjaman_aktif) * 100
        logger.info(f"[Members] GetAdminDashboard: npl_percentage={npl_percentage} (based on angsuran Belum Bayar)")
        
        # 5. Total funding disetujui
        all_funding = funding_service.get_funding_list(db)
        total_funding = 0.0
        for f in all_funding:
            try:
                if str(f.status) == "Disetujui":
                    total_funding += float(f.nominal) if f.nominal else 0.0
            except Exception as e:
                logger.error(f"[Members] Error processing funding: {str(e)}")
        
        # 6. Total members
        total_members = db.query(Anggota).count()
        logger.info(f"[Members] GetAdminDashboard: total_members={total_members}")
        
        # 7. SHU Tahunan (proyeksi 0.0006% dari total saldo)
        shu_tahunan = total_saldo * 0.000006
        logger.info(f"[Members] GetAdminDashboard: shu_tahunan={shu_tahunan}")
        
        return {
            "total_members": total_members,
            "total_saldo": total_saldo,
            "pinjaman_aktif": total_pinjaman_aktif,
            "total_pinjaman_diajukan": total_pinjaman_diajukan,
            "total_pinjaman_ditolak": total_pinjaman_ditolak,
            "budget_persiapan": budget_persiapan,
            "total_angsuran_belum_bayar": total_angsuran_belum_bayar,
            "total_funding": total_funding,
            "shu_tahunan": shu_tahunan,
            "npl_percentage": npl_percentage,
        }
    except Exception as e:
        logger.error(f"[Members] GetAdminDashboard failed: {str(e)}")
        raise

@router.put("/{anggota_id}", response_model=AnggotaResponse)
def update_anggota(
    anggota_id: int,
    anggota_update: AnggotaUpdate,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """Update anggota data (admin only or self)"""
    logger.info(f"[Members] Update: id={anggota_id}, user_id={current_anggota.id}")
    try:
        # Check permissions: admin or self
        if current_anggota.role != "admin" and current_anggota.id != anggota_id:
            logger.warning(f"[Members] Update failed: insufficient permissions - user_id={current_anggota.id}")
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        db_anggota = db.query(Anggota).filter(Anggota.id == anggota_id).first()
        if not db_anggota:
            logger.warning(f"[Members] Update failed: not found - id={anggota_id}")
            raise HTTPException(status_code=404, detail="Anggota not found")
        
        update_data = anggota_update.dict(exclude_unset=True)
        
        # Hash password if provided
        if "password" in update_data and update_data["password"]:
            from app.core.security import get_password_hash
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(db_anggota, field, value)
        
        db.add(db_anggota)
        db.commit()
        db.refresh(db_anggota)
        logger.info(f"[Members] Updated: id={anggota_id}")
        return db_anggota
    except Exception as e:
        logger.error(f"[Members] Update failed: {str(e)}")
        raise
