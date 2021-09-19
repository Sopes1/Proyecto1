#define LINUX

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>

#include <linux/module.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>

/* to get works meminfo */
#include <linux/hugetlb.h>
#include <linux/mm.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <asm/page.h>
#include <asm/pgtable.h>

#include <linux/percpu.h>
#include <linux/vmalloc.h>
#include <linux/configfs.h>

#include <linux/ktime.h>
#include <linux/timekeeping.h>
#include <linux/time.h>
//#include <linux/errno.h>

struct task_struct *task;       /*    Structure defined in sched.h for tasks/processes    */
struct task_struct *task_child; /*    Structure needed to iterate through task children    */
struct list_head *list;         /*    Structure needed to iterate through the list in each task->children struct    */
struct timespec64 tsa;
struct timespec64 tsb;
int cantidad;

#define PROCFS_NAME "cpumodule"


static int OS3_show(struct seq_file *m, void *v)
{
    ktime_get_real_ts64(&tsa);
    printk(KERN_INFO "%s", "LOADING MODULE\n"); /*    good practice to log when loading/removing modules    */
    int cantidad;
    for_each_process(task)
    { 
        printk(KERN_INFO "%s", "process n\n");
        if (task->state != 0){
            cantidad = cantidad + 1; 
        }
    };
    seq_printf(m,"%d\n",cantidad);
    ktime_get_real_ts64(&tsb);
    seq_printf(m,"%ld\n",tsa.tv_nsec/tsb.tv_nsec+1);
	return 0;
}

static int OS3_open(struct inode *inode, struct file *file)
{
    return single_open(file, OS3_show, NULL);
}

static const struct proc_ops OS3_fops = {
    .proc_open = OS3_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};

static int __init OS3_init(void)
{
    printk(KERN_INFO "Cargando modulo.\r\n");
    proc_create(PROCFS_NAME, 0, NULL, &OS3_fops);
    printk(KERN_INFO "Completado. Procceso: /proc/%s.\r\n", PROCFS_NAME);
    return 0;
}

static void __exit OS3_exit(void)
{
    remove_proc_entry(PROCFS_NAME, NULL);
    printk(KERN_INFO "Modulo deshabilitado.\r\n");
}

module_init(OS3_init);
module_exit(OS3_exit);
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("módulo que lee la lista de procesos");
MODULE_LICENSE("Grupo10");
